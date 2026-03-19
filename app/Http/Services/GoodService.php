<?php

namespace App\Http\Services;

use App\Http\Resources\GoodResource;
use App\Models\Good;
use Carbon\Carbon;

class GoodService extends Service
{
    /*
     * Get All Goods
     */
    public function index($request)
    {
        $goodsQuery = new Good;

        $goodsQuery = $this->search($goodsQuery, $request);

        $goods = $goodsQuery
            ->orderBy("id", "asc")
            ->paginate(20);

        return [true, $goods->count() . " Goods Retrieved Successfully", $goods];
    }

    /*
     * Get One Good
     */
    public function show($id)
    {
        $good = Good::findOrFail($id);

        return [true, $good->name . " Retrieved Successfully", $good];
    }

    /*
     * Store Good
     */
    public function store($request)
    {
        $goodNumber = Good::count() + 1;
        $paddedGoodNumber = str_pad($goodNumber, 3, '0', STR_PAD_LEFT);

        $code = "G-" . $paddedGoodNumber;

        $good = new Good;
        $good->code = $code;
        $good->name = $request->name;
        $good->markup = $request->markup;
        $good->notification_quantity = $request->notificationQuantity;
        $good->created_by = $this->id;
        $saved = $good->save();

        $message = $good->name . " created successfully";

        return [$saved, $message, $good];
    }

    /*
     * Update Good
     */
    public function update($request, $id)
    {
        $good = Good::find($id);

        if ($request->filled("name")) {
            $good->name = $request->name;
        }

        if ($request->filled("markup")) {
            $good->markup = $request->markup;
        }

        if ($request->filled("notificationQuantity")) {
            $good->notification_quantity = $request->notificationQuantity;
        }

        $saved = $good->save();

        $message = $good->name . " updated successfully";

        return [$saved, $message, $good];
    }

    /*
     * Delete Good
     */
    public function destroy($id)
    {
        $good = Good::findOrFail($id);

        $deleted = $good->delete();

        $message = $good->name . " deleted successfully";

        return [$deleted, $message, $good];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        if ($request->filled("code")) {
            $query = $query->where("code", "LIKE", "%" . $request->code . "%");
        }

        if ($request->filled("name")) {
            $query = $query->where("name", "LIKE", "%" . $request->name . "%");
        }

        if ($request->filled("createdBy")) {
            $query = $query->where("created_by", $request->createdBy);
        }

        return $query;
    }
}
