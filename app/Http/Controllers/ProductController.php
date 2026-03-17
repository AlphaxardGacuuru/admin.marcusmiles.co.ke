<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Http\Services\ProductService;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(protected ProductService $service)
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
        [$status, $message, $products] = $this->service->index($request);

        return ProductResource::collection($products)
            ->additional([
                "status" => $status,
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
            "price" => "required|numeric",
        ]);

        [$saved, $message, $product] = $this->service->store($request);

        return (new ProductResource($product))->additional([
            "status" => $saved,
            "message" => $message,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        [$status, $message, $product] = $this->service->show($product);

        return (new ProductResource($product))->additional([
            "status" => $status,
            "message" => $message,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "name" => "required|string",
            "price" => "required|numeric",
        ]);

        [$updated, $message, $product] = $this->service->update($request, $id);

        return (new ProductResource($product))->additional([
            "status" => $updated,
            "message" => $message,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $product] = $this->service->destroy($id);

        return (new ProductResource($product))->additional([
            "status" => $deleted,
            "message" => $message,
        ]);
    }
}
