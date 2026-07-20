#!/usr/bin/env python3
import csv

input_file = 'interfaces-analysis-with-recommendations.csv'
output_file = 'interfaces-analysis-with-recommendations-fixed.csv'

# Expected column order
expected_columns = [
    'interface', 'field', 'recommendation', 'type', 'optional',
    'comment', 'export_modifier', 'extends', 'readonly', 'filepath', 'line_number'
]

fixed_rows = []
fixed_count = 0
total_count = 0

with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    fixed_rows.append(header)

    for row in reader:
        total_count += 1

        # Check if this is a broken row:
        # - Column 6 (export_modifier) should be "export" or empty
        # - If it's numeric, the row is broken
        if len(row) >= 11:
            export_modifier_col = row[6]
            extends_col = row[7]

            # Detect broken row: export_modifier is numeric and extends is "export"
            if export_modifier_col.isdigit() and extends_col == 'export':
                # Broken format: interface,field,recommendation,type,optional,comment,LINE_NUM,export,extends_val,readonly_val,filepath
                # Should be:     interface,field,recommendation,type,optional,comment,export,extends_val,readonly_val,filepath,LINE_NUM

                fixed_row = [
                    row[0],  # interface
                    row[1],  # field
                    row[2],  # recommendation
                    row[3],  # type
                    row[4],  # optional
                    row[5],  # comment
                    row[7],  # export_modifier (was in extends position)
                    row[8],  # extends (was in readonly position)
                    row[9],  # readonly (was in filepath position)
                    row[10], # filepath (was in line_number position)
                    row[6],  # line_number (was in export_modifier position)
                ]
                fixed_rows.append(fixed_row)
                fixed_count += 1
            else:
                # Row is already correct
                fixed_rows.append(row)
        else:
            # Row doesn't have enough columns, keep as-is
            fixed_rows.append(row)

# Write fixed CSV
with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(fixed_rows)

print(f"✅ Fixed {fixed_count} out of {total_count} rows")
print(f"📄 Output written to: {output_file}")
