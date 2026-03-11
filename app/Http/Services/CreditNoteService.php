<?php

namespace App\Http\Services;

use App\Models\CreditNote;
use App\Models\Invoice;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CreditNoteService extends Service
{
    /*
     * Fetch All Credit Notes
     */
    public function index($request)
    {
        $query = new CreditNote;

        $query = $this->search($query, $request);

        $creditNotes = $query
            ->with(['user', 'invoice.user'])
            ->orderBy("id", "DESC")
            ->paginate($request->per_page ?? 20)
            ->appends($request->all());

        $sum = $query->sum("amount");

        return [$creditNotes, $sum];
    }

    /*
     * Fetch Credit Note
     */
    public function show($id)
    {
        return CreditNote::with(['user', 'invoice.user'])->find($id);
    }

    /*
     * Save Credit Note
     */
    public function store($request)
    {
        $invoice = Invoice::find($request->invoiceId);

        $creditNote = new CreditNote;
        $creditNote->user_id = $invoice->user_id;
        $creditNote->invoice_id = $request->invoiceId;
        $creditNote->amount = $request->amount;
        $creditNote->issue_date = $request->issueDate;
        $creditNote->notes = $request->notes;

        $saved = DB::transaction(function () use ($creditNote) {
            $saved = $creditNote->save();

            $this->updateInvoiceStatus($creditNote->invoice_id);

            return $saved;
        });

        return [$saved, "Credit Note Created Successfully", $creditNote];
    }

    /*
     * Update Credit Note
     */
    public function update($request, $id)
    {
        $creditNote = CreditNote::find($id);
        $creditNote->amount = $request->input("amount", $creditNote->amount);
        $creditNote->issue_date = $request->input("issueDate", $creditNote->issue_date);
        $creditNote->notes = $request->input("notes", $creditNote->notes);

        $saved = DB::transaction(function () use ($creditNote) {
            $saved = $creditNote->save();

            $this->updateInvoiceStatus($creditNote->invoice_id);

            return $saved;
        });

        return [$saved, "Credit Note Updated Successfully", $creditNote];
    }

    /*
     * Destroy Credit Note
     */
    public function destroy($id)
    {
        $ids = explode(",", $id);

        $deleted = DB::transaction(function () use ($ids) {
            $query = CreditNote::whereIn("id", $ids);

            $deleted = $query->delete();

            $this->updateInvoiceStatus($query->first()->invoice_id);

            return $deleted;
        });

        $message = count($ids) > 1 ?
            "Credit Notes Deleted Successfully" :
            "Credit Note Deleted Successfully";

        return [$deleted, $message, ""];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        if ($request->filled("number")) {
            $query = $query->where("id", "LIKE", "%" . $request->number . "%");
        }

        if ($request->filled("invoiceId")) {
            $query = $query->where("invoice_id", $request->invoiceId);
        }

        $clientId = $request->input("clientId");

        if ($request->filled("clientId")) {
            $query = $query->whereHas("user", function ($query) use ($clientId) {
                $query->where("id", $clientId);
            });
        }

        if ($request->filled("startDate")) {
            $query = $query->whereDate("issue_date", ">=", $request->startDate);
        }

        if ($request->filled("endDate")) {
            $query = $query->whereDate("issue_date", "<=", $request->endDate);
        }

        if ($request->filled("minAmount")) {
            $query = $query->where("amount", ">=", $request->minAmount);
        }

        if ($request->filled("maxAmount")) {
            $query = $query->where("amount", "<=", $request->maxAmount);
        }

        return $query;
    }
}
