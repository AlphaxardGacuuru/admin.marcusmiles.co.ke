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
            ->with(['project', 'invoice'])
            ->orderBy("id", "DESC")
            ->paginate(20);

        $sum = $query->sum("amount");

        return [$creditNotes, $sum];
    }

    /*
     * Fetch Credit Note
     */
    public function show($id)
    {
        $creditNote = CreditNote::with(['project', 'invoice'])->find($id);

        return [true, "Credit Note Fetched Successfully", $creditNote];
    }

    /*
     * Save Credit Note
     */
    public function store($request)
    {
        $invoice = Invoice::find($request->invoiceId);

        $creditNote = new CreditNote;
        $creditNote->code = $this->generateUniqueCode(CreditNote::class);
        $creditNote->project_id = $invoice->project_id;
        $creditNote->invoice_id = $request->invoiceId;
        $creditNote->amount = $request->amount;
        $creditNote->issue_date = $request->issueDate;
        $creditNote->notes = $request->notes;
        $creditNote->created_by = $this->id;

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
        $creditNote->invoice_id = $request->input("invoiceId", $creditNote->invoice_id);
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
     * Destroy CreditNote
     */
    public function destroy($id)
    {
        $ids = explode(",", $id);

        [$deleted, $creditNote] = DB::transaction(function () use ($ids) {

            foreach ($ids as $itemId) {
                $creditNote = CreditNote::findOrFail($itemId);

                $deleted = $creditNote->delete();
            }

            $this->updateInvoiceStatus($creditNote->invoice_id);

            return $deleted;
        });

        $message = count($ids) > 1 ?
            "CreditNotes Deleted Successfully" :
            "CreditNote Deleted Successfully";

        return [$deleted, $message, $creditNote];
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
