<?php

namespace App\Http\Services;

use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\InvoiceItem;
use App\Models\User;
use App\Notifications\InvoiceNotification;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceService extends Service
{
    /*
     * Fetch All Invoices
     */
    public function index($request)
    {
        $invoiceQuery = new Invoice;

        $invoiceQuery = $this->search($invoiceQuery, $request);

        $invoices = $invoiceQuery
            ->orderBy("id", "DESC")
            ->paginate($request->per_page ?? 20);

        $sum = $invoiceQuery->sum("total");
        $balance = $invoiceQuery->sum("balance");
        $paid = $invoiceQuery->sum("paid");
        $statuses = ["not_paid", "paid", "partially_paid", "overdue"];

        return [$invoices, $sum, $balance, $paid, $statuses];
    }

    /*
     * Fetch Invoice
     */
    public function show($id)
    {
        return Invoice::find($id);
    }

    /*
     * Save Invoice
     */
    public function store($request)
    {
        $invoice = new Invoice;
        $invoice->user_id = $request->clientId;
        $invoice->issue_date = $request->issueDate;
        $invoice->due_date = $request->dueDate;
        $invoice->total = $request->total;
        $invoice->balance = $request->total;
        $invoice->notes = $request->notes;
        $invoice->terms = $request->terms;
        $invoice->status = $request->status;

        $saved = DB::transaction(function () use ($invoice, $request) {
            $saved = $invoice->save();

            // Invoice Items
            foreach ($request->invoiceItems as $item) {
                $invoiceItem = new InvoiceItem;
                $invoiceItem->invoice_id = $invoice->id;
                $invoiceItem->description = $item['description'];
                $invoiceItem->quantity = $item['quantity'];
                $invoiceItem->rate = $item['rate'];
                $invoiceItem->amount = $item['amount'];
                Log::info("Invoice Request: ", $invoiceItem->toArray());
                $saved = $invoiceItem->save();
            }

            $this->updateInvoiceStatus($invoice->id);

            return $saved;
        });

        return [$saved, "Invoice Created Successfully", $invoice];
    }

    /*
	* Update Invoice
	*/
    public function update($request, $id)
    {
        $invoice = Invoice::find($id);
        $invoice->user_id = $request->input("clientId", $invoice->user_id);
        $invoice->issue_date = $request->input("issueDate", $invoice->issue_date);
        $invoice->due_date = $request->input("dueDate", $invoice->due_date);
        $invoice->total = $request->input("total", $invoice->total);
        $invoice->notes = $request->input("notes", $invoice->notes);
        $invoice->terms = $request->input("terms", $invoice->terms);
        $invoice->status = $request->input("status", $invoice->status);

        $saved = DB::transaction(function () use ($invoice, $request) {
            $saved = $invoice->save();

            // Delete existing items
            InvoiceItem::where("invoice_id", $invoice->id)->delete();

            // Invoice Items
            foreach ($request->invoiceItems as $item) {
                $invoiceItem = new InvoiceItem;
                $invoiceItem->invoice_id = $invoice->id;
                $invoiceItem->description = $item['description'];
                $invoiceItem->quantity = $item['quantity'];
                $invoiceItem->rate = $item['rate'];
                $invoiceItem->amount = $item['amount'];
                $saved = $invoiceItem->save();
            }

            $this->updateInvoiceStatus($invoice->id);

            return $saved;
        });

        return [$saved, "Invoice Updated Successfully", $invoice];
    }

    /*
     * Destroy Invoice
     */
    public function destroy($id)
    {
        $ids = explode(",", $id);

        $deleted = DB::transaction(function () use ($ids) {
            $deleted = Invoice::whereIn("id", $ids)->delete();

            $this->updateInvoiceStatus($ids[0]);

            return $deleted;
        });

        $message = count($ids) > 1 ?
            "Invoices Deleted Successfully" :
            "Invoice Deleted Successfully";

        return [$deleted, $message, ""];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        $number = $request->input("number");

        if ($request->filled("number")) {
            $query = $query->where("id", "LIKE", "%" . $number . "%");
        }

        $clientId = $request->input("clientId");

        if ($request->filled("clientId")) {
            $query = $query->whereHas("user", function ($query) use ($clientId) {
                $query->where("id", $clientId);
            });
        }

        $status = $request->input("status");

        if ($request->filled("status")) {
            $statuses = explode(",", $status);

            $query = $query->whereIn("status", $statuses);
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
            $query = $query->where("created_at", ">=", $startDate);
        }

        // Build end date filter
        if ($request->filled("endMonth") || $request->filled("endYear")) {
            $year = $endYear ?? date('Y');
            $month = $endMonth ?? 12;
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();
            $query = $query->where("created_at", "<=", $endDate);
        }

        return $query;
    }

    /*
	 * Generate Invoice PDF
	 */
    public function generatePdf($id)
    {
        $invoice = Invoice::findOrFail($id);

        // This looks for resources/views/invoices/pdf.blade.php
        $pdf = Pdf::loadView('invoices.pdf', compact('invoice'));

        return $pdf;
    }

    public function sendInvoiceEmail($id)
    {
        $invoice = Invoice::findOrFail($id);

        $generatedPdf = $this->generatePdf($id);

        $pdf = $generatedPdf->output();

        $al = User::where("email", "alphaxardgacuuru47@gmail.com")->first();

        // $al->notify(new InvoiceNotification($invoice, $pdf));
        $invoice->user->notify(new InvoiceNotification($invoice, $pdf));
    }
}
