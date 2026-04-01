<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body {
            /* font-family: 'Helvetica', 'Arial', sans-serif; */
            font-family: 'DejaVu Sans', sans-serif;
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

        .check {
            font-size: 14px;
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
                    <h2 class="doc-title">WAGE SHEET</h2>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Meta info --}}
        <table>
            <tr>
                <td width="100%" class="text-right">
                    <p class="label">Form No: <span class="value">{{ $wageSheet->code ?? '-' }}</span></p>
                    <p class="label">Project No: <span class="value">{{ $wageSheet->project->code ?? '-' }}</span></p>
                    <p class="label">Issue Date: <span class="value">{{ $wageSheet->created_at ?? '-' }}</span></p>
                    <p class="label">Week: <span class="value">{{ $wageSheet->starts_at ?? '-' }} - {{ $wageSheet->ends_at ?? '-' }}</span></p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Project / Client --}}
        <p class="label">Project: <span class="value">{{ $wageSheet->project->name ?? '-' }}</span></p>
        <p class="label">Client: <span class="value">{{ $wageSheet->project->client->name ?? '-' }}</span></p>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Service Providers Table --}}
        @php
            $providers = $wageSheet->wageSheetServiceProviders ?? collect();
            $totalWages = 0;
            $dayKeys = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        @endphp

        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 4%;">No</th>
                    <th style="width: 18%;">Name</th>
                    <th style="width: 14%;">Duty</th>
                    <th style="width: 9%;">KES / Hr</th>
                    <th style="width: 4%;">S</th>
                    <th style="width: 4%;">M</th>
                    <th style="width: 4%;">T</th>
                    <th style="width: 4%;">W</th>
                    <th style="width: 4%;">T</th>
                    <th style="width: 4%;">F</th>
                    <th style="width: 4%;">S</th>
                    <th style="width: 12%;">Total (KES)</th>
                    <th style="width: 15%;">Sign</th>
                </tr>
            </thead>
            <tbody>
                @forelse($providers as $index => $provider)
                @php
                    $days = $provider->days ?? [];
                    $totalDays = collect($days)->filter()->count();
                    $labourRate = $provider->projectServiceProvider->labour_rate ?? 0;
                    $rowTotal = $labourRate * $totalDays;
                    $totalWages += $rowTotal;
                @endphp
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $provider->projectServiceProvider->serviceProvider->name ?? '-' }}</td>
                    <td>{{ $provider->projectServiceProvider->service ?? '-' }}</td>
                    <td>{{ $labourRate }}</td>
                    @foreach($dayKeys as $day)
                    <td class="text-center">{{ !empty($days[$day]) ? '✓' : '' }}</td>
                    @endforeach
                    <td>{{ number_format($rowTotal, 2) }}</td>
                    <td></td>
                </tr>
                @empty
                <tr>
                    <td colspan="13" class="text-center">No service providers found</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">

        {{-- First Footer --}}
        <table style="margin-top: 10px;">
            <tr>
                <td style="width: 50%;">
                    <p class="footer-label">TOTAL LABOR FORCE: <span class="footer-value">{{ $providers->count() }}</span></p>
                    <p class="footer-label">SUSPENDED LABOR:</p>
                    <p class="footer-label">TERMINATED LABOR:</p>
                    <p class="footer-label">TOTAL EQUIPMENT HIRED:</p>
                    <p class="footer-label">NOTES</p>
                </td>
                <td style="width: 25%;">
                    <p class="footer-label">TOTAL WAGES: KES <span class="footer-value">{{ number_format($totalWages, 2) }}</span></p>
                    <p class="footer-label">VALUE OF DAMAGED WORK:</p>
                    <p class="footer-label">WAGES PAID: KES <span class="footer-value">{{ number_format($totalWages, 2) }}</span></p>
                    <p class="footer-label">TOTAL AMOUNT PAID: KES <span class="footer-value">{{ number_format($totalWages, 2) }}</span></p>
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0;">

        {{-- Second Footer --}}
        <table style="margin-top: 10px;">
            <tr>
                <td style="width: 50%;">
                    <p class="footer-label">Prepared by: <span class="footer-value">{{ $wageSheet->createdBy->name ?? '-' }}</span></p>
                    <p class="footer-label">Paid by: <span class="footer-value">{{ $wageSheet->paidBy->name ?? '-' }}</span></p>
                </td>
                <td style="width: 25%;">
                    <p class="footer-label">Approved by: <span class="footer-value">{{ $wageSheet->approvedBy->name ?? '-' }}</span></p>
                </td>
            </tr>
        </table>

    </div>
</body>
</html>
