<?php

namespace App\Http\Services;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class OrderService extends Service
{
	/**
	 * Display a listing of the resource.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function index($request)
	{
		$query = Order::query();

		$query = $this->search($request, $query);

		$orders = $query
			->orderBy('id', 'desc')
			->paginate(20);

		$statuses = ['pending', 'confirmed', 'fulfilled'];

		return [true, $orders->count() . ' Orders Retrieved Successfully', $orders, $statuses];
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return array
	 */
	public function store($request)
	{
		$order = new Order();
		$order->code = $this->generateUniqueCode(Order::class);
		$order->client_id = $request->clientId;
		$order->total = $request->total;
		$order->notes = $request->notes;
		$order->status = "pending";
		$order->created_by = $this->id;

		return DB::transaction(function () use ($order, $request) {
			$saved = $order->save();

			foreach ($request->items as $item) {
				$orderItem = new OrderItem();
				$orderItem->order_id = $order->id;
				$orderItem->product_id = $item["productId"];
				$orderItem->quantity = $item["quantity"];
				$orderItem->rate = $item["rate"];
				$orderItem->total = $item["total"];
				$saved = $orderItem->save();
			}

			return [$saved, 'Order Created Successfully', $order];
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
		$order = Order::findOrFail($id);

		return [true, 'Order Retrieved Successfully', $order];
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
		$order = Order::findOrFail($id);
		$order->client_id = $request->clientId;
		$order->total = $request->total;
		$order->notes = $request->notes;
		$order->status = $request->status;

		return DB::transaction(function () use ($order, $request) {
			$saved = $order->save();

			// Delete old items
			OrderItem::where('order_id', $order->id)->delete();

			foreach ($request->items as $item) {
				$orderItem = new OrderItem;
				$orderItem->order_id = $order->id;
				$orderItem->product_id = $item["productId"];
				$orderItem->quantity = $item["quantity"];
				$orderItem->rate = $item["rate"];
				$orderItem->total = $item["total"];
				$saved = $orderItem->save();
			}

			return [$saved, 'Order Updated Successfully', $order];
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
		$order = Order::findOrFail($id);

		$deleted = $order->delete();

		return [$deleted, 'Order Deleted Successfully', $order];
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
			$query = $query->where("client_id", $request->clientId);
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