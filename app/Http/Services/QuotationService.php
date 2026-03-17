<?php

namespace App\Http\Services;

use App\Http\Resources\QuotationResource;
use App\Models\Quotation;
use App\Models\QuotationItem;
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
		$quotation->project_id = $request->projectId;
		$quotation->total = $request->total;
		$quotation->issue_date = $request->issueDate;
		$quotation->expiry_date = $request->expiryDate;
		$quotation->notes = $request->notes;
		$quotation->status = $request->status;

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
            $query = $query->whereHas("project.client", function($query) use($request) {
                $query->where("id", $request->clientId);
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
