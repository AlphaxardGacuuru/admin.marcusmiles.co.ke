<?php

namespace App\Http\Services;

use App\Http\Resources\QuotationResource;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Quotation;
use App\Models\QuotationItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class QuotationService extends Service
{
	/**
	 * Display a listing of the resource.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function index($request)
	{
		$query = Quotation::query();

		$query = $this->search($request, $query);

		$quotations = $query
			->orderBy('id', 'desc')
			->paginate(20);

		$statuses = ['sent', 'accepted', 'declined', 'expired'];

		return [true, $quotations->count() . ' Quotations Retrieved Successfully', $quotations, $statuses];
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return array
	 */
	public function store($request)
	{
		$quotation = new Quotation;
		$quotation->code = $this->generateUniqueCode(Quotation::class);
		$quotation->project_id = $request->projectId;
		$quotation->total = $request->total;
		$quotation->tax = $request->tax;
		$quotation->issue_date = $request->issueDate;
		$quotation->expiry_date = $request->expiryDate;
		$quotation->notes = $request->notes;
		$quotation->status = $request->status;
		$quotation->created_by = $this->id;

		return DB::transaction(function () use ($quotation, $request) {
			$saved = $quotation->save();

			foreach ($request->items as $item) {
				$quotationItem = new QuotationItem;
				$quotationItem->quotation_id = $quotation->id;
				$quotationItem->description = $item["description"];
				$quotationItem->quantity = $item["quantity"];
				$quotationItem->rate = $item["rate"];
				$quotationItem->total = $item["total"];
				$saved = $quotationItem->save();
			}

			return [$saved, 'Quotation Created Successfully', $quotation];
		});
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		$quotation = Quotation::findOrFail($id);

		return [true, 'Quotation Retrieved Successfully', $quotation];
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return array
	 */
	public function update($request, $id)
	{
		$quotation = Quotation::findOrFail($id);
		$quotation->project_id = $request->input("projectId", $quotation->project_id);
		$quotation->total = $request->input("total", $quotation->total);
		$quotation->tax = $request->input("tax", $quotation->tax);
		$quotation->issue_date = $request->input("issueDate", $quotation->issue_date);
		$quotation->expiry_date = $request->input("expiryDate", $quotation->expiry_date);
		$quotation->notes = $request->input("notes", $quotation->notes);
		$quotation->status = $request->input("status", $quotation->status);

		return DB::transaction(function () use ($quotation, $request) {
			$saved = $quotation->save();

			// Delete old items
			QuotationItem::where('quotation_id', $quotation->id)->delete();

			foreach ($request->items as $item) {
				$quotationItem = new QuotationItem;
				$quotationItem->quotation_id = $quotation->id;
				$quotationItem->description = $item["description"];
				$quotationItem->quantity = $item["quantity"];
				$quotationItem->rate = $item["rate"];
				$quotationItem->total = $item["total"];
				$saved = $quotationItem->save();
			}

			return [$saved, 'Quotation Updated Successfully', $quotation];
		});
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return array
	 */
	public function destroy($id)
	{
		$quotation = Quotation::findOrFail($id);

		$deleted = $quotation->delete();

		return [$deleted, 'Quotation Deleted Successfully', $quotation];
	}

	/**
	 * Generate invoice from quotation.
	 *
	 * @param int $id
	 * @return array
	 */
	public function generateInvoice($id)
	{
		$quotation = Quotation::with('quotationItems')->findOrFail($id);

		return DB::transaction(function () use ($quotation) {
			$invoice = new Invoice;
			$invoice->code = $this->generateUniqueCode(Invoice::class);
			$invoice->project_id = $quotation->project_id;
			$invoice->issue_date = Carbon::now()->toDateString();
			$invoice->due_date = $quotation->expiry_date;
			$invoice->total = $quotation->total;
			$invoice->balance = $quotation->total;
			$invoice->status = 'not_paid';
			$invoice->created_by = $this->id;

			$sourceNote = 'Generated from quotation ' . $quotation->code;
			$invoice->notes = $quotation->notes
				? trim($quotation->notes . PHP_EOL . PHP_EOL . $sourceNote)
				: $sourceNote;

			$saved = $invoice->save();

			foreach ($quotation->quotationItems as $item) {
				$invoiceItem = new InvoiceItem;
				$invoiceItem->invoice_id = $invoice->id;
				$invoiceItem->description = $item->description;
				$invoiceItem->quantity = $item->quantity;
				$invoiceItem->rate = $item->rate;
				$invoiceItem->total = $item->total;
				$saved = $invoiceItem->save();
			}

			$this->updateInvoiceStatus($invoice->id);

			return [$saved, 'Invoice Generated Successfully', $invoice];
		});
	}

	public function search($request, $query)
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

		$status = $request->input("status");

		if ($request->filled("status")) {
			$statuses = explode(",", $status);

			$query = $query->whereIn("status", $statuses);
		}

		if ($request->filled("createdBy")) {
			$query = $query->where("created_by", $request->createdBy);
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
			$query = $query->where("issue_date", ">=", $startDate);
		}

		// Build end date filter
		if ($request->filled("endMonth") || $request->filled("endYear")) {
			$year = $endYear ?? date('Y');
			$month = $endMonth ?? 12;
			$endDate = Carbon::create($year, $month, 1)->endOfMonth();
			$query = $query->where("issue_date", "<=", $endDate);
		}

		return $query;
	}
}
