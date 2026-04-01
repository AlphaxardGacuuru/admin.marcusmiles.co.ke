<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #111827; line-height: 1.5; margin: 0; padding: 0; background: #fff; }
        .page { padding: 28px 32px; }
        table { width: 100%; border-collapse: collapse; }
        td { vertical-align: top; }
        .company-title { font-size: 13px; font-weight: 700; margin: 0 0 2px 0; text-transform: uppercase; }
        .company-line { margin: 0; color: #374151; font-size: 11px; }
        .doc-title { font-size: 20px; text-align: right; margin: 0 0 2px 0; color: #111827; font-weight: 700; }
        .label { font-size: 12px; font-weight: 700; color: #111827; margin: 2px 0; }
        .value { font-weight: 400; color: #111827; }
        .small-note { color: #111827; font-size: 8px; font-weight: 700; text-align: left; margin: 2px 0 0 0; }
        .items-table { margin-top: 16px; }
        .items-table th { text-align: left; padding: 8px 6px; border-bottom: 2px solid #111827; color: #111827; font-size: 11px; font-weight: 700; }
        .items-table td { padding: 8px 6px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 11px; }
        .text-right { text-align: right; }
        .footer-label { color: #111827; font-weight: 700; font-size: 11px; margin: 2px 0; }
        .notes-text { font-size: 12px; color: #374151; line-height: 1.8; margin: 6px 0; }
    </style>
</head>
<body>
    <div class="page">

        {{-- Header --}}
        <table>
            <tr>
                <td style="width: 8%;">
                    <img src="{{ public_path('img/favicon.png') }}" alt="Logo" style="width: 60px; height: auto;">
                    <p class="small-note">RESEARCH. DESIGN &amp; ENG.<br>AUDIT PROJECT MANAGEMENT</p>
                </td>
                <td style="width: 52%;">
                    <p class="company-title">MARCUS MILES CONSULT LTD - DESIGN &amp; BUILD</p>
                    <p class="company-line">Kilifi House, Lavington</p>
                    <p class="company-line">PO BOX 7763-00300</p>
                    <p class="company-line">KRA PIN P051650553D Nairobi</p>
                    <p class="company-line">Kenya</p>
                    <p class="company-line">www.marcusmiles.co.ke</p>
                </td>
                <td></td>
                <td style="width: 28%;" class="text-right">
                    <p class="doc-title">CREDIT NOTE</p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Meta info --}}
        <table>
            <tr>
                <td style="width: 50%;">
                    <p class="label">Client / Project:</p>
                    <p class="value">{{ $creditNote->project->name ?? '-' }}</p>
                </td>
                <td style="width: 50%;" class="text-right">
                    <p class="label">Credit Note No: <span class="value">{{ $creditNote->code ?? '-' }}</span></p>
                    <p class="label">Credit Note Date: <span class="value">{{ $creditNote->issue_date ?? '-' }}</span></p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Items Table --}}
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 70%;">Description</th>
                    <th style="width: 30%;" class="text-right">Amount (KES)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Credit Note for Invoice {{ $creditNote->invoice->code ?? '-' }}</td>
                    <td class="text-right">{{ number_format($creditNote->amount ?? 0, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Notes --}}
        @if(!empty($creditNote->notes))
        <p class="label" style="margin-bottom: 4px;">Notes</p>
        <p class="notes-text">{{ $creditNote->notes }}</p>
        @endif

    </div>
</body>
</html>
