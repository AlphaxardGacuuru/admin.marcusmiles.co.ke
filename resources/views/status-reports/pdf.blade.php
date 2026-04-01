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

        .company-title {
            font-size: 13px;
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
            font-size: 20px;
            text-align: right;
            margin: 0 0 2px 0;
            color: #111827;
            font-weight: 700;
        }

        .label {
            font-size: 12px;
            font-weight: 700;
            color: #111827;
            margin: 2px 0;
        }

        .value {
            font-weight: 400;
            color: #111827;
        }

        .small-note {
            color: #111827;
            font-size: 8px;
            font-weight: 700;
            text-align: left;
            margin: 2px 0 0 0;
        }

        .section-title {
            font-size: 12px;
            font-weight: 700;
            color: #111827;
            margin: 10px 0 6px 0;
        }

        .phase-list {
            margin: 0 0 6px 0;
            padding-left: 18px;
            font-size: 11px;
        }

        .phase-list li {
            margin-bottom: 3px;
        }

        .items-table {
            margin-top: 16px;
        }

        .items-table th {
            text-align: left;
            padding: 8px 6px;
            border-bottom: 2px solid #111827;
            color: #111827;
            font-size: 11px;
            font-weight: 700;
        }

        .items-table td {
            padding: 8px 6px;
            border-bottom: 1px solid #e5e7eb;
            color: #1f2937;
            font-size: 11px;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }

        .footer-label {
            color: #111827;
            font-weight: 700;
            font-size: 10px;
            margin: 2px 0;
        }

        .footer-value {
            color: #111827;
            font-weight: 400;
        }
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
                <td style="width: 50%;">
                    <p class="company-title">MARCUS MILES CONSULT LTD - DESIGN &amp; BUILD</p>
                    <p class="company-line">Kilifi House, Lavington</p>
                    <p class="company-line">PO BOX 7763-00300</p>
                    <p class="company-line">KRA PIN P051650553D Nairobi</p>
                    <p class="company-line">Kenya</p>
                    <p class="company-line">www.marcusmiles.co.ke</p>
                </td>
                <td></td>
                <td style="width: 25%;" class="text-right">
                    <h2 class="doc-title">STATUS REPORT</h2>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Meta info --}}
        <table>
            <tr>
                <td width="100%" class="text-right">
                    <p class="label">Form No: <span class="value">{{ $statusReport->code ?? '-' }}</span></p>
                    <p class="label">Project No: <span class="value">{{ $statusReport->project->code ?? '-' }}</span></p>
                    <p class="label">Issue Date: <span class="value">{{ $statusReport->created_at ?? '-' }}</span></p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Project / Client --}}
        <p class="label">Project: <span class="value">{{ $statusReport->project->name ?? '-' }}</span></p>
        <p class="label">Client: <span class="value">{{ $statusReport->project->client->name ?? '-' }}</span></p>
        <p class="label">Lead Consultant: <span class="value">Marcus Miles LTD</span></p>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Project Phase Key --}}
        <p class="section-title">PROJECT PHASE</p>
        <ul class="phase-list">
            <li><strong>INITIATION:</strong> Identifying project objectives, investigate feasibility, and approve a solution.</li>
            <li><strong>PLANNING:</strong> Design a solution, identify tasks &amp; resource requirements, schedule in detailed steps, assess budget and risk.</li>
            <li><strong>EXECUTION:</strong> Implement plan. Control time, quality &amp; budget. Communication &amp; documentation, monitoring &amp; adjustments.</li>
            <li><strong>CLOSURE:</strong> Release final deliverables, terminate contracts. Hand over project to stakeholders. Audit &amp; Review.</li>
        </ul>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Action Items Table --}}
        <p class="section-title">Action Items</p>
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%;">No</th>
                    <th style="width: 35%;">Item</th>
                    <th style="width: 20%;">In Charge</th>
                    <th style="width: 15%;">Due Date</th>
                    <th style="width: 25%;">Comment</th>
                </tr>
            </thead>
            <tbody>
                @forelse($statusReport->actionItems ?? [] as $key => $actionItem)
                    <tr>
                        <td>{{ $key + 1 }}</td>
                        <td>{{ $actionItem->item ?? '-' }}</td>
                        <td>{{ $actionItem->inCharge ?? '-' }}</td>
                        <td>{{ $actionItem->dueDate ?? '-' }}</td>
                        <td>{{ $actionItem->comments ?? '-' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center">No action items available</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">

        {{-- Footer --}}
        <table style="margin-top: 10px;">
            <tr>
                <td style="width: 50%;">
                    <p class="footer-label">Prepared by: <span class="footer-value">{{ $statusReport->createdBy->name ?? '-' }}</span></p>
                </td>
                <td style="width: 25%;">
                    <p class="footer-label">Approved by: <span class="footer-value">{{ $statusReport->approvedBy->name ?? '-' }}</span></p>
                </td>
            </tr>
        </table>

    </div>
</body>
</html>
