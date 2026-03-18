<?php

namespace App\Http\Services;

use App\Models\Payment;
use App\Models\Invoice;
use App\Models\User;
use App\Notifications\PaymentNotification;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

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
        if ($request->filled("code")) {
            $query = $query->where("code", "LIKE", "%" . $request->code . "%");
        }

        if ($request->filled("invoiceId")) {
            $query = $query->where("invoice_id", $request->invoiceId);
        }

        if ($request->filled("projectId")) {
            $query = $query->where("project_id", $request->projectId);
        }

        if ($request->filled("clientId")) {
            $query = $query->whereHas("project.client", function ($query) use ($request) {
                $query->where("id", $request->clientId);
            });
        }

        if ($request->filled("createdBy")) {
            $query = $query->where("created_by", $request->createdBy);
        }

        if ($request->filled("minAmount")) {
            $query = $query->where("amount", ">=", $request->minAmount);
        }

        if ($request->filled("maxAmount")) {
            $query = $query->where("amount", "<=", $request->maxAmount);
        }

        $startMonth = $request->input("startMonth");
        $endMonth = $request->input("endMonth");
        $startYear = $request->input("startYear");
        $endYear = $request->input("endYear");

        // Build start date filter
        if ($request->filled("startMonth") || $request->filled("startYear")) {
            $year = $startYear ?? date('Y'); 
            $month = $startMonth ?? 1;
            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $query = $query->where("payment_date", ">=", $startDate);
        }

        // Build end date filter
        if ($request->filled("endMonth") || $request->filled("endYear")) {
            $year = $endYear ?? date('Y');
            $month = $endMonth ?? 12;
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();
            $query = $query->where("payment_date", "<=", $endDate);
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
