<?php

namespace App\Http\Controllers;

use App\Http\Resources\GoodResource;
use App\Http\Services\GoodService;
use App\Models\Good;
use Illuminate\Http\Request;

class GoodController extends Controller
{
    public function __construct(protected GoodService $service)
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
        [$saved, $message, $goods] = $this->service->index($request);

        return GoodResource::collection($goods)->additional([
            "status" => $saved,
            "message" => $message,
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
            "name" => "required|string",
            "notificationQuantity" => "required|string",
        ]);

        [$saved, $message, $good] = $this->service->store($request);

        return (new GoodResource($good))->additional([
            "status" => $saved,
            "message" => $message,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Good  $good
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        [$saved, $message, $good] = $this->service->show($id);

        return (new GoodResource($good))->additional([
            "status" => $saved,
            "message" => $message,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Good  $good
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "name" => "nullable|string",
            "notificationQuantity" => "nullable|string",
        ]);

        [$saved, $message, $good] = $this->service->update($request, $id);

        return (new GoodResource($good))->additional([
            "status" => $saved,
            "message" => $message,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Good  $good
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $good] = $this->service->destroy($id);

        return (new GoodResource($good))->additional([
            "status" => $deleted,
            "message" => $message,
        ]);
    }
}
