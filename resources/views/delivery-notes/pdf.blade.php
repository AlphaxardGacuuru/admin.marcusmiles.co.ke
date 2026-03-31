<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        /* General Styles */
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 13px;
            color: #333;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .invoice-container {
            padding: 40px;
            background: #fff;
        }

        /* Layout Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        td {
            vertical-align: top;
        }

        /* Header */
        .header-table td {
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .invoice-title {
            font-size: 28px;
            text-align: right;
            margin: 0;
            color: #111827;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: bold;
            margin-top: 8px;
        }
        /* Status Colors */
        .bg-red { background-color: #ef4444; color: #fff; }
        .bg-yellow { background-color: #f59e0b; color: #fff; }
        .bg-green { background-color: #16a34a; color: #fff; }
        .bg-gray { background-color: #4b5563; color: #fff; }

        /* Billed To / Info */
        .info-table {
            margin-top: 30px;
        }
        .info-label {
            font-size: 14px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 5px;
        }
        .info-text {
            color: #4b5563;
        }

        /* Line Items Table */
        .items-table {
            margin-top: 20px;
        }
        .items-table th {
            text-align: left;
            padding: 12px 8px;
            border-bottom: 2px solid #374151;
            color: #374151;
            font-size: 12px;
        }
        .items-table td {
            padding: 12px 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }

        /* Totals */
        .totals-table {
            width: 40%;
            margin-left: 60%;
            margin-top: 20px;
        }
        .totals-table td {
            padding: 8px;
        }
        .balance-row {
            border-top: 2px solid #111827;
            font-weight: bold;
            font-size: 16px;
        }

        /* Footer */
        .footer {
            margin-top: 50px;
            text-align: center;
        }
        .thanks {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .business-info {
            text-align: right;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <table class="header-table">
            <tr>
                <td>
                    <div>
						<img src="{{ public_path('images/default-monochrome-black.svg') }}" alt="Logo" style="height: 40px;">
                    </div>
                </td>
                <td class="text-right">
                    <h2 class="invoice-title">INVOICE</h2>
                    @php
                        $statusClass = match($deliveryNote->status) {
                            'not_paid' => 'bg-red',
                            'partially_paid' => 'bg-yellow',
                            'paid' => 'bg-green',
                            default => 'bg-gray'
                        };
                    @endphp
                    <span class="status-badge {{ $statusClass }}">
                        {{ str_replace('_', ' ', $deliveryNote->status) }}
                    </span>
                </td>
            </tr>
        </table>

        <table class="info-table">
            <tr>
                <td width="50%">
                    <div class="info-label">Billed To</div>
                    <div class="info-text">
                        Client: {{ $deliveryNote->user->name }}<br>
                        Email: {{ $deliveryNote->user->email }}<br>
                        @if($deliveryNote->user->phone)
                            Phone: {{ $deliveryNote->user->phone }}
                        @endif
                    </div>
                </td>
                <td width="50%" class="text-right">
                    <div class="info-label">Invoice No: {{ $deliveryNote->number }}</div>
                    <div class="info-text">
                        Issue Date: {{ $deliveryNote->issue_date->format("d M Y") }}<br>
                        Due Date: {{ $deliveryNote->due_date->format("d M Y") }}<br>
                    </div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-right">Rate</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($deliveryNote->invoiceItems as $item)
                <tr>
                    <td>{{ $item['description'] }}</td>
                    <td class="text-center">{{ $item['quantity'] }}</td>
                    <td class="text-right">
                        <small>KES</small> {{ number_format($item['rate'], 2) }}
                    </td>
                    <td class="text-right">
                        <small>KES</small> {{ number_format($item['amount'], 2) }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <table class="totals-table">
            <tr>
                <td class="text-right">Subtotal:</td>
                <td class="text-right">KES {{ number_format($deliveryNote->total, 2) }}</td>
            </tr>
            <tr>
                <td class="text-right" style="color: #16a34a;">Paid:</td>
                <td class="text-right" style="color: #16a34a;">KES {{ number_format($deliveryNote->paid, 2) }}</td>
            </tr>
            <tr class="balance-row">
                <td class="text-right">Balance Due:</td>
                <td class="text-right">KES {{ number_format($deliveryNote->balance, 2) }}</td>
            </tr>
        </table>

        @if($deliveryNote->notes || $deliveryNote->terms)
        <table style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <tr>
                @if($deliveryNote->notes)
                <td width="50%" style="padding-right: 20px;">
                    <div class="info-label">Notes</div>
                    <div class="info-text" style="font-size: 11px;">{{ $deliveryNote->notes }}</div>
                </td>
                @endif
                @if($deliveryNote->terms)
                <td width="50%">
                    <div class="info-label">Terms & Conditions</div>
                    <div class="info-text" style="font-size: 11px;">{{ $deliveryNote->terms }}</div>
                </td>
                @endif
            </tr>
        </table>
        @endif

        <div class="footer">
            <div class="thanks">Pay to 0700364446 via M-Pesa.</div>
            <div class="thanks">Thank you for your business!</div>
        </div>

        <div class="business-info">
            <div class="info-label">Black Developers</div>
            <div class="info-text">
                Email: al@developers.black.co.ke<br>
                Phone: +254 700 364446
            </div>
        </div>
    </div>
</body>
</html>