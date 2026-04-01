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
        .text-right { text-align: right; }
        .footer-label { color: #111827; font-weight: 700; font-size: 11px; margin: 2px 0; }
        .footer-value { color: #374151; font-weight: 400; font-size: 11px; }
        .grey-block { background-color: #f3f4f6; padding: 100px 20px; margin: 0; }
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
                    <p class="doc-title">SITE VISIT REPORT</p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Meta info --}}
        <table>
            <tr>
                <td width="100%" class="text-right">
                    <p class="label">Form No: <span class="value">{{ $siteVisitReport->code ?? '-' }}</span></p>
                    <p class="label">Project No: <span class="value">{{ $siteVisitReport->project->code ?? '-' }}</span></p>
                    <p class="label">Issue Date: <span class="value">{{ $siteVisitReport->created_at ?? '-' }}</span></p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Project / Client --}}
        <p class="label">Project: <span class="value">{{ $siteVisitReport->project->name ?? '-' }}</span></p>
        <p class="label">Client: <span class="value">{{ $siteVisitReport->project->client->name ?? '-' }}</span></p>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Signing / notes area --}}
        <div class="grey-block"></div>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Footer --}}
        <table style="margin-top: 10px;">
            <tr>
                <td style="width: 50%;">
                    <p class="footer-label">Prepared By</p>
                    <p class="footer-value">{{ $siteVisitReport->createdBy->name ?? '-' }}</p>
                </td>
                <td style="width: 10%;">
                    <p class="footer-label">Approved By</p>
                    <p class="footer-value">{{ $siteVisitReport->approvedBy->name ?? '-' }}</p>
                </td>
            </tr>
        </table>

    </div>
</body>
</html>
