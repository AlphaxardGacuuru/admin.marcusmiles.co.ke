<?php

namespace App\Http\Services;

use App\Models\Invoice;
use App\Models\Project;
use App\Models\Inventory;
use App\Models\Payment;
use App\Models\CreditNote;
use Carbon\Carbon;

class CRMDashboardService extends Service
{

	public function index()
	{
		return [
			"clients" => $this->clients(),
			"quotations" => $this->quotations(),
			"invoices" => $this->invoices(),
			"payments" => $this->payments(),
			"creditNotes" => $this->creditNotes(),
		];
	}

	/*
     * Projects
     */
	public function clients()
	{
		$chartBox = $this->getChartBoxData(Project::class);

		$getProjectsThisYear = $this->clientsThisYear();

		return [
			"chartBox" => $chartBox,
			"clientsThisYear" => $getProjectsThisYear
		];
	}

	/*
     * Quotations
     */
	public function quotations()
	{
		$chartBox = $this->getChartBoxData(Inventory::class);

		$getQuotationsThisYear = $this->quotationsThisYear();

		return [
			"chartBox" => $chartBox,
			"quotationsThisYear" => $getQuotationsThisYear
		];
	}

	/*
     * Invoices
     */
	public function invoices()
	{
		$chartBox = $this->getChartBoxData(Invoice::class);

		$getInvoicesThisYear = $this->invoicesThisYear();

		return [
			"chartBox" => $chartBox,
			"invoicesThisYear" => $getInvoicesThisYear
		];
	}

	/*
     * Payments
     */
	public function payments()
	{
		$chartBox = $this->getChartBoxData(Payment::class);

		$getPaymentsThisYear = $this->paymentsThisYear();

		return [
			"chartBox" => $chartBox,
			"paymentsThisYear" => $getPaymentsThisYear
		];
	}

	/*
     * Credit Notes
     */
	public function creditNotes()
	{
		$chartBox = $this->getChartBoxData(CreditNote::class);

		$getCreditNotesThisYear = $this->creditNotesThisYear();

		return [
			"chartBox" => $chartBox,
			"creditNotesThisYear" => $getCreditNotesThisYear
		];
	}

	public function getChartBoxData($model)
	{
		$query = $model::query();

		$total = $query->count();

		// Growth over the last week compared to the week before
		$startOfThisWeek = Carbon::now()->startOfWeek();
		$startOfLastWeek = Carbon::now()->subWeek()->startOfWeek();

		$thisWeekCount = $model::where('created_at', '>=', $startOfThisWeek)->count();
		$lastWeekCount = $model::whereBetween('created_at', [$startOfLastWeek, $startOfThisWeek])->count();

		$growth = $lastWeekCount > 0 ? (($thisWeekCount - $lastWeekCount) / $lastWeekCount) * 100 : 0;

		// Data for last 7 days
		$last7Days = [];
		for ($i = 6; $i >= 0; $i--) {
			$date = Carbon::now()->subDays($i)->format('Y-m-d');
			$count = $model::whereDate('created_at', $date)->count();
			$last7Days[] = $count;
		}

		return [
			"total" => $total,
			"growth" => round($growth, 1),
			"data" => $last7Days,
		];
	}

	public function clientsThisYear()
	{
		$query = Project::query();

		$getProjectsThisYear = $query
			->selectRaw("MONTH(created_at) as month, count(*) as count")
			->whereYear("created_at", Carbon::now()->year)
			->groupBy("month")
			->get()
			->map(fn($item) => [
				"month" => $this->allMonths[$item->month - 1],
				"count" => $item->count,
			]);

		[$labels, $data] = $this->getLabelsAndData($getProjectsThisYear);

		return [
			"labels" => $labels,
			"data" => $data,
		];
	}

	public function quotationsThisYear()
	{
		$query = Inventory::query();

		$getQuotationsThisYear = $query
			->selectRaw("MONTH(created_at) as month, count(*) as count")
			->whereYear("created_at", Carbon::now()->year)
			->groupBy("month")
			->get()
			->map(fn($item) => [
				"month" => $this->allMonths[$item->month - 1],
				"count" => $item->count,
			]);

		[$labels, $data] = $this->getLabelsAndData($getQuotationsThisYear);

		return [
			"labels" => $labels,
			"data" => $data,
		];
	}

	public function invoicesThisYear()
	{
		$query = Invoice::query();

		$getInvoicesThisYear = $query
			->selectRaw("MONTH(created_at) as month, count(*) as count")
			->whereYear("created_at", Carbon::now()->year)
			->groupBy("month")
			->get()
			->map(fn($item) => [
				"month" => $this->allMonths[$item->month - 1],
				"count" => $item->count,
			]);

		[$labels, $data] = $this->getLabelsAndData($getInvoicesThisYear);

		return [
			"labels" => $labels,
			"data" => $data,
		];
	}

	public function paymentsThisYear()
	{
		$query = Payment::query();

		$getPaymentsThisYear = $query
			->selectRaw("MONTH(created_at) as month, count(*) as count")
			->whereYear("created_at", Carbon::now()->year)
			->groupBy("month")
			->get()
			->map(fn($item) => [
				"month" => $this->allMonths[$item->month - 1],
				"count" => $item->count,
			]);

		[$labels, $data] = $this->getLabelsAndData($getPaymentsThisYear);

		return [
			"labels" => $labels,
			"data" => $data,
		];
	}

	public function creditNotesThisYear()
	{
		$query = CreditNote::query();

		$getCreditNotesThisYear = $query
			->selectRaw("MONTH(created_at) as month, count(*) as count")
			->whereYear("created_at", Carbon::now()->year)
			->groupBy("month")
			->get()
			->map(fn($item) => [
				"month" => $this->allMonths[$item->month - 1],
				"count" => $item->count,
			]);

		[$labels, $data] = $this->getLabelsAndData($getCreditNotesThisYear);

		return [
			"labels" => $labels,
			"data" => $data,
		];
	}
}