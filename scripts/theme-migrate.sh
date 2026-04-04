#!/bin/bash
# Vytalis Research theme migration — bulk color replacement
# Only touches .tsx and .ts files under src/

SRC="src"

# Primary green: #004225 → #0B6B3A
find "$SRC" -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/#004225/#0B6B3A/g'

# Action green: #2E7D52 → #0B6B3A
find "$SRC" -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/#2E7D52/#0B6B3A/g'

# Soft green bg: #E8F5EE → #E6F2EC
find "$SRC" -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/#E8F5EE/#E6F2EC/g'

# Page bg: #F8FAFC → #F7F9F8
find "$SRC" -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/#F8FAFC/#F7F9F8/g'

# Dark text: #0F172A → #1F2A24
find "$SRC" -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/#0F172A/#1F2A24/g'

# Muted text: #94A3B8 → #6B7771
find "$SRC" -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/#94A3B8/#6B7771/g'

# Borders: #E2E8F0 → #E5ECE8
find "$SRC" -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/#E2E8F0/#E5ECE8/g'

# Body text: #475569 → #6B7771
find "$SRC" -name '*.tsx' -o -name '*.ts' | xargs sed -i '' 's/#475569/#6B7771/g'

echo "Done — all colors migrated."
