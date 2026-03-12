<?php

namespace App\Http\Services;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\CreditNote;
use Carbon\Carbon;

class Service
{
    public $id;

    public function __construct()
    {
        // Current User ID
        $auth = auth('sanctum')->user();

        $this->id = $auth ? $auth->id : 0;
    }

    /**
     * Generate a reusable code for a given model
     *
     * @param string $model
     * @param int $padLength
     * @return string
     */
    protected function generateUniqueCode($model, $padLength = 3)
    {
        $currentYear = Carbon::now()->format('y');
        $newNumber = $model::count() + 1;
        $code = str_pad($newNumber, $padLength, '0', STR_PAD_LEFT);

        return $currentYear . $code;
    }

    public function updateInvoiceStatus($invoiceId)
    {
        $invoiceQuery = Invoice::findOrFail($invoiceId);

        $invoices = $invoiceQuery
            ->orderBy("created_at", "ASC")
            ->get();

        $paymentQuery = Payment::where("invoice_id", $invoiceId);

        $totalPayments = $paymentQuery->sum("amount");

        $creditNoteQuery = CreditNote::where("invoice_id", $invoiceId);

        $totalCreditNotes = $creditNoteQuery->sum("amount");

        $paid = $totalPayments + $totalCreditNotes;

        $invoices->each(function ($invoice) use (&$paid) {
            if ($paid <= 0) {
                $invoice->paid = 0;
                $invoice->balance = $invoice->total;
                $invoice->status = "not_paid";
            } else if ($paid < $invoice->total) {
                $invoice->paid = $paid;
                $invoice->balance = $invoice->total - $paid;
                $invoice->status = "partially_paid";
            } else if ($paid >= $invoice->total) {
                $invoice->paid = $invoice->total;
                $invoice->balance = 0;
                $invoice->status = "paid";
            }

            $invoice->save();

            $paid -= $invoice->paid;
        });
    }
}
