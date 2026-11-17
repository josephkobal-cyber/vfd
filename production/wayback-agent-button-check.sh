#!/bin/bash
# When was the "Try talking to our agent" button live on virtualfrontdesk.com?
# Checks every Wayback Machine snapshot since FROM for the button text, on the
# homepage and the AI Receptionist page, and prints evidence + date ranges.
# Run on your Mac:  bash wayback-agent-button-check.sh
# Output is also saved to wayback-agent-button-report.md next to this script.

FROM="20260928"
PHRASE="Try talking to our agent"
PAGES="https://www.virtualfrontdesk.com/ https://www.virtualfrontdesk.com/ai-receptionist"
OUT="$(cd "$(dirname "$0")" && pwd)/wayback-agent-button-report.md"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) wayback-button-check"

fmt() { echo "$1" | sed -E 's/^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2}).*/\1-\2-\3 \4:\5 UTC/'; }

{
echo "# \"$PHRASE\" button: Wayback Machine evidence"
echo
echo "Snapshots checked from $(fmt ${FROM}0000 | cut -c1-10) to today. Generated $(date -u '+%Y-%m-%d %H:%M UTC')."
} > "$OUT"

for PAGE in $PAGES; do
  echo "Checking $PAGE ..."
  LIST=$(curl -s -A "$UA" "https://web.archive.org/cdx/search/cdx?url=${PAGE#https://}&from=${FROM}&filter=statuscode:200&fl=timestamp,original")
  if [ -z "$LIST" ]; then
    printf "\n## %s\n\nNo snapshots found since %s.\n" "$PAGE" "$FROM" >> "$OUT"; continue
  fi
  { printf "\n## %s\n\n| Snapshot (UTC) | Button on page? | Evidence link |\n|---|---|---|\n" "$PAGE"; } >> "$OUT"
  RANGES=""; PREV=""; START=""; LAST=""
  while read -r TS ORIG; do
    [ -z "$TS" ] && continue
    sleep 1
    HTML=$(curl -s -L -A "$UA" "https://web.archive.org/web/${TS}id_/${ORIG}")
    if [ -z "$HTML" ]; then STATE="unknown (fetch failed)"
    elif echo "$HTML" | grep -qi "$PHRASE"; then STATE="YES"
    else STATE="no"; fi
    echo "  $(fmt $TS)  $STATE"
    echo "| $(fmt $TS) | $STATE | https://web.archive.org/web/${TS}/${ORIG} |" >> "$OUT"
    [ "$STATE" = "unknown (fetch failed)" ] && continue
    if [ "$STATE" != "$PREV" ]; then
      [ -n "$PREV" ] && RANGES="${RANGES}- **$([ "$PREV" = YES ] && echo LIVE || echo NOT LIVE)**: $(fmt $START) to $(fmt $LAST) (next snapshot $(fmt $TS) shows the change)\n"
      START="$TS"; PREV="$STATE"
    fi
    LAST="$TS"
  done <<< "$LIST"
  [ -n "$PREV" ] && RANGES="${RANGES}- **$([ "$PREV" = YES ] && echo LIVE || echo NOT LIVE)**: $(fmt $START) to $(fmt $LAST) (latest snapshot)\n"
  printf "\n**Date ranges** (the exact switch happened somewhere between the two snapshots around each change):\n\n%b" "$RANGES" >> "$OUT"
done

echo
echo "Done. Report saved to: $OUT"
cat "$OUT"
