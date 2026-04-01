<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #111827;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background: #fff;
        }

        .page {
            padding: 28px 32px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            vertical-align: top;
        }

        .header {
            border-bottom: 0;
            padding-bottom: 14px;
        }

        .company-title {
            font-size: 10px;
            font-weight: 700;
            margin: 0 0 2px 0;
            text-transform: uppercase;
        }

        .company-line {
            margin: 0;
            color: #374151;
            font-size: 11px;
        }

        .doc-title {
            font-size: 18px;
            text-align: right;
            margin: 0 0 2px 0;
            color: #111827;
            font-weight: 700;
        }

        .meta-section {
            margin-top: 10px;
            padding-bottom: 8px;
        }

        .label {
            font-size: 13px;
            font-weight: 700;
            color: #111827;
            margin: 2px 0;
        }

        .value {
            font-weight: 400;
            color: #111827;
        }

        .items-table {
            margin-top: 16px;
            border: 0;
        }

        .items-table th {
            text-align: left;
            padding: 10px 8px;
            border-bottom: 2px solid #111827;
            color: #111827;
            font-size: 12px;
            font-weight: 700;
        }

        .items-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
            color: #1f2937;
        }

        .text-start { text-align: left; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }

        .footer {
            margin-top: 40px;
        }

        .footer-label {
            color: #111827;
            font-weight: 700;
            font-size: 12px;
            margin-bottom: 2px;
        }

        .footer-value {
            color: #111827;
            font-size: 12px;
            margin: 0;
        }

        .role-note {
            color: #6b7280;
            font-size: 10px;
            font-weight: 400;
        }

        .small-note {
            /* margin-top: 30px; */
            color: #111827;
            font-size: 9px;
            font-weight: 700;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="page">
        <table class="header">
            <tr>
                <td style="width: 5%;">
                    <img src="{{ public_path('img/favicon.png') }}" alt="Logo" style="width: 75%; height: auto;">
                    <p class="small-note">RESEARCH. DESIGN & ENG. AUDIT PROJECT MANAGEMENT</p>
                </td>
                <td style="width: 40%;">
                    <p class="company-title">MARCUS MILES CONSULT LTD - DESIGN & BUILD</p>
                    <p class="company-line">Kilifi House, Lavington</p>
                    <p class="company-line">PO BOX 7763-00300</p>
                    <p class="company-line">KRA PIN P051650553D Nairobi</p>
                    <p class="company-line">Kenya</p>
                    <p class="company-line">www.marcusmiles.co.ke</p>
                </td>
                <td></td>
                <td style="width: 30%;" class="text-right">
                    <h2 class="doc-title">DELIVERY NOTE</h2>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

        <table class="meta-section">
            <tr>
                <td width="100%" class="text-right">
                    <p class="label">Form No: <span class="value">{{ $deliveryNote->code ?? '-' }}</span></p>
                    <p class="label">Project No: <span class="value">{{ $deliveryNote->project->code ?? '-' }}</span></p>
                    <p class="label">Issue Date: <span class="value">{{ $deliveryNote->createdAt ?? '-' }}</span></p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #eee;">

        <table class="project-row" style="margin: 10px 0;">
            <tr>
                <td>
                    <p class="label">Project: <span class="value">{{ $deliveryNote->project->name ?? '-' }}</span></p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #eee;">

        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%;">No</th>
                    <th style="width: 15%;">BOQ REF</th>
                    <th style="width: 35%;">Item Description</th>
                    <th style="width: 15%;">Unit</th>
                    <th style="width: 10%;">Quantity</th>
                    <th style="width: 20%;">Approval</th>
                </tr>
            </thead>
            <tbody>
                @forelse($deliveryNote->inventories as $index => $inventory)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td></td>
                    <td>{{ $inventory->good->name ?? '-' }}</td>
                    <td>
                        @php
                            $unit = $inventory->unit ?? null;
                            $unitValue = is_array($unit) ? ($unit['value'] ?? '') : ($unit->value ?? '');
                            $unitName = is_array($unit) ? ($unit['unit'] ?? '') : ($unit->unit ?? '');
                        @endphp
                        {{ trim($unitValue . ' ' . $unitName) ?: '-' }}
                    </td>
                    <td>{{ $inventory->quantity ?? '-' }}</td>
                    <td>{{ $inventory->createdBy->name ?? '-' }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="text-center">No inventory items found</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <table class="footer">
            <tr>
                <td style="width: 100%;">
                    <p class="footer-label">Received By: 
                        <span class="footer-value">{{ $deliveryNote->receivedBy->name ?? '-' }}</span>
                        <span class="role-note">(Clerk of Works)</span>
                    </p>
                    
                    <p class="footer-label">Approved By: 
                        <span class="footer-value">{{ $deliveryNote->createdBy->name ?? '-' }}</span>
                        <span class="role-note">(Construction Manager)</span>
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>