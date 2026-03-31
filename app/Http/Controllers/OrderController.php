<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Services\OrderService;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(protected OrderService $service)
    {
        //
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        [$status, $message, $orders, $statuses] = $this->service->index($request);

        return (OrderResource::collection($orders))->additional([
            "status" => $status,
            "message" => $message,
            "statuses" => $statuses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            "clientId" => "required|integer|exists:users,id",
            "tax" => "required|numeric|min:0",
            "total" => "required|numeric|min:0",
            "notes" => "nullable|string",
            "items" => "required|array|min:1",
            "items.*.productId" => "required|integer|exists:products,id",
            "items.*.quantity" => "required|integer|min:1",
            "items.*.rate" => "required|numeric|min:0",
            "items.*.total" => "required|numeric|min:0",
        ]);

        [$saved, $message, $order] = $this->service->store($request);

        return (new OrderResource($order))->additional([
            "status" => $saved,
            "message" => $message,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        [$status, $message, $order] = $this->service->show($id);

        return (new OrderResource($order))->additional([
            "status" => $status,
            "message" => $message,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "clientId" => "sometimes|integer|exists:users,id",
            "tax" => "sometimes|numeric|min:0",
            "total" => "sometimes|numeric|min:0",
            "notes" => "nullable|string",
            "status" => "sometimes|string|in:pending,completed,cancelled",
            "items" => "sometimes|array|min:1",
            "items.*.productId" => "required|integer|exists:products,id",
            "items.*.quantity" => "required|integer|min:1",
            "items.*.rate" => "required|numeric|min:0",
            "items.*.total" => "required|numeric|min:0",
        ]);

        [$saved, $message, $order] = $this->service->update($request, $id);

        return (new OrderResource($order))->additional([
            "status" => $saved,
            "message" => $message,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $order] = $this->service->destroy($id);

        return (new OrderResource($order))->additional([
            "status" => $deleted,
            "message" => $message,
        ]);
    }
}
