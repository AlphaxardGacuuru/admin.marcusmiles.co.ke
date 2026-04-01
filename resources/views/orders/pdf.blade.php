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
        .text-center { text-align: center; }
        .footer-label { color: #111827; font-weight: 700; font-size: 11px; margin: 2px 0; }
        .footer-value { color: #374151; font-weight: 400; font-size: 11px; }
        .status-line { font-size: 11px; font-weight: 700; text-align: right; text-transform: uppercase; margin: 4px 0 0 0; }
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
                    <p class="doc-title">ORDER</p>
                    <p class="status-line">Status: {{ strtoupper(str_replace('_', ' ', $order->status ?? '')) }}</p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Meta info --}}
        <table>
            <tr>
                <td style="width: 50%;">
                    <p class="label">Client / Project:</p>
                    <p class="value">{{ $order->client->name ?? '-' }}</p>
                </td>
                <td style="width: 50%;" class="text-right">
                    <p class="label">Order No: <span class="value">{{ $order->code ?? '-' }}</span></p>
                    <p class="label">Order Date: <span class="value">{{ $order->created_at ?? '-' }}</span></p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Items --}}
        <p class="label" style="margin-bottom: 8px;">Items</p>
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 40%;">Product</th>
                    <th style="width: 10%;" class="text-center">Qty</th>
                    <th style="width: 25%;" class="text-right">Unit Price (KES)</th>
                    <th style="width: 25%;" class="text-right">Total (KES)</th>
                </tr>
            </thead>
            <tbody>
                @forelse($order->orderItems as $item)
                <tr>
                    <td>{{ $item->product->name ?? '-' }}</td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">{{ number_format($item->rate, 2) }}</td>
                    <td class="text-right">{{ number_format($item->total, 2) }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="text-center" style="padding: 12px; color: #9ca3af;">No items found</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        {{-- Grand Total --}}
        <table style="margin-top: 10px;">
            <tr>
                <td style="width: 60%;"></td>
                <td style="width: 40%;" class="text-right">
                    <p class="label" style="font-size: 13px;">Grand Total: <span class="value">KES {{ number_format($order->total ?? 0, 2) }}</span></p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Notes / Footer --}}
        <p class="label" style="margin-bottom: 4px;">Terms &amp; Notes</p>
        <p class="notes-text">{{ $order->notes ?? 'No notes available.' }}</p>
        <p class="footer-label">NCBA TO LAVINGTON BRANCH</p>
        <p class="footer-label">MARCUS MILES CONSULT LTD</p>
        <p class="footer-label">9666020013</p>

        <table style="margin-top: 20px;">
            <tr>
                <td width="100%">
                    <p class="footer-label">Prepared By: <span class="footer-value">{{ $order->createdBy->name ?? '-' }}</span></p>
                </td>
            </tr>
        </table>

    </div>
</body>
</html>
