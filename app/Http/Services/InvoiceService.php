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
        if ($request->filled("idAndName")) {
            $invoices = Invoice::select("id", "code")
                ->orderBy("id", "DESC")
                ->get();

            return [$invoices, 0, 0, 0, []];
        }

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
        $invoice = Invoice::findOrFail($id);

        return [true, "Invoice Fetched Successfully", $invoice];
    }

    /*
     * Save Invoice
     */
    public function store($request)
    {
        $invoice = new Invoice;
        $invoice->code = $this->generateUniqueCode(Invoice::class);
        $invoice->project_id = $request->projectId;
        $invoice->issue_date = $request->issueDate;
        $invoice->due_date = $request->dueDate;
        $invoice->notes = $request->notes;
        $invoice->balance = $request->total;
        $invoice->total = $request->total;
        $invoice->status = "not_paid";
        $invoice->created_by = $this->id;

        $saved = DB::transaction(function () use ($invoice, $request) {
            $saved = $invoice->save();

            // Invoice Items
            foreach ($request->items as $item) {
                $invoiceItem = new InvoiceItem;
                $invoiceItem->invoice_id = $invoice->id;
                $invoiceItem->description = $item["description"];
                $invoiceItem->quantity = $item["quantity"];
                $invoiceItem->rate = $item["rate"];
                $invoiceItem->amount = $item["total"];
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
        $invoice = Invoice::findOrFail($id);
        $invoice->project_id = $request->projectId;
        $invoice->issue_date = $request->issueDate;
        $invoice->due_date = $request->dueDate;
        $invoice->notes = $request->notes;
        $invoice->balance = $request->total;
        $invoice->total = $request->total;

        $saved = DB::transaction(function () use ($invoice, $request) {
            $saved = $invoice->save();

            // Delete existing items
            InvoiceItem::where("invoice_id", $invoice->id)->delete();

            // Invoice Items
            foreach ($request->items as $item) {
                $invoiceItem = new InvoiceItem;
                $invoiceItem->invoice_id = $invoice->id;
                $invoiceItem->description = $item["description"];
                $invoiceItem->quantity = $item["quantity"];
                $invoiceItem->rate = $item["rate"];
                $invoiceItem->amount = $item["total"];
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

        foreach ($ids as $itemId) {
            $invoice = Invoice::findOrFail($itemId);

            $deleted = $invoice->delete();
        }

        $message = count($ids) > 1 ?
            "Invoices Deleted Successfully" :
            "Invoice Deleted Successfully";

        return [$deleted, $message, $invoice];
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
}
