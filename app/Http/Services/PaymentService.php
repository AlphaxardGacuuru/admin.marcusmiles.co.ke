<?php

namespace App\Http\Services;

use App\Models\Payment;
use App\Models\Invoice;
use App\Models\User;
use App\Notifications\PaymentNotification;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class PaymentService extends Service
{
    /*
     * Fetch All Payments
     */
    public function index($request)
    {
        $query = new Payment;

        $query = $this->search($query, $request);

        $payments = $query
            ->with(['project', 'invoice'])
            ->orderBy("id", "DESC")
            ->paginate(20);

        $sum = $query->sum("amount");

        return [true, $payments->count() . " Fetched Successfully", $payments, $sum];
    }

    /*
     * Fetch Payment
     */
    public function show($id)
    {
        $payment = Payment::with(['project', 'invoice'])->find($id);

        return [true, "Payment Fetched Successfully", $payment];
    }

    /*
     * Save Payment
     */
    public function store($request)
    {
        $invoice = Invoice::find($request->selectedInvoiceId);

        $payment = new Payment;
        $payment->code = $this->generateUniqueCode(Payment::class);
        $payment->project_id = $invoice->project_id;
        $payment->invoice_id = $request->selectedInvoiceId;
        $payment->amount = $request->amount;
        $payment->payment_date = $request->paymentDate;
        $payment->notes = $request->notes;
        $payment->created_by = $this->id;

        $saved = DB::transaction(function () use ($payment) {
            $saved = $payment->save();

            $this->updateInvoiceStatus($payment->invoice_id);

            return $saved;
        });

        return [$saved, "Payment Created Successfully", $payment];
    }

    /*
     * Update Payment
     */
    public function update($request, $id)
    {
        $payment = Payment::find($id);
        $payment->invoice_id = $request->input("selectedInvoiceId", $payment->invoice_id);
        $payment->amount = $request->input("amount", $payment->amount);
        $payment->payment_date = $request->input("paymentDate", $payment->payment_date);
        $payment->notes = $request->input("notes", $payment->notes);

        $saved = DB::transaction(function () use ($payment) {
            $saved = $payment->save();

            $this->updateInvoiceStatus($payment->invoice_id);

            return $saved;
        });

        return [$saved, "Payment Updated Successfully", $payment];
    }

    /*
     * Destroy Payment
     */
    public function destroy($id)
    {
        $ids = explode(",", $id);

        [$deleted, $payment] = DB::transaction(function () use ($ids) {

            foreach ($ids as $itemId) {
                $payment = Payment::findOrFail($itemId);

                $deleted = $payment->delete();
            }

            $this->updateInvoiceStatus($payment->invoice_id);

            return $deleted;
        });

        $message = count($ids) > 1 ?
            "Payments Deleted Successfully" :
            "Payment Deleted Successfully";

        return [$deleted, $message, $payment];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        if ($request->filled("number")) {
            $query = $query->where("id", "LIKE", "%" . $request->number . "%");
        }

        $clientId = $request->input("clientId");

        if ($request->filled("clientId")) {
            $query = $query->whereHas("user", function ($query) use ($clientId) {
                $query->where("id", $clientId);
            });
        }

        if ($request->filled("invoiceId")) {
            $query = $query->where("invoice_id", $request->invoiceId);
        }

        if ($request->filled("startDate")) {
            $query = $query->whereDate("payment_date", ">=", $request->startDate);
        }

        if ($request->filled("endDate")) {
            $query = $query->whereDate("payment_date", "<=", $request->endDate);
        }

        if ($request->filled("minAmount")) {
            $query = $query->where("amount", ">=", $request->minAmount);
        }

        if ($request->filled("maxAmount")) {
            $query = $query->where("amount", "<=", $request->maxAmount);
        }

        return $query;
    }

    /*
	 * Generate Payment PDF
	 */
    public function generatePdf($id)
    {
        $payment = Payment::findOrFail($id);

        // This looks for resources/views/payments/pdf.blade.php
        $pdf = Pdf::loadView('payments.pdf', compact('payment'));

        return $pdf;
    }

    public function sendReceiptEmail($id)
    {
        $payment = Payment::findOrFail($id);

        $generatedPdf = $this->generatePdf($id);

        $pdf = $generatedPdf->output();

        $al = User::where("email", "alphaxardgacuuru47@gmail.com")->first();

        $al->notify(new PaymentNotification($payment, $pdf));
        // $payment->user->notify(new PaymentNotification($payment));
    }
}
