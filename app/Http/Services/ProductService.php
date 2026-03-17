<?php

namespace App\Http\Services;

use App\Models\Product;

class ProductService extends Service
{
	public function index($request)
	{
		$query = Product::query();

		$query = $this->search($query, $request);

		$products = $query
			->orderBy("id", "DESC")
			->paginate(20);

		return [true, $products->count() . " Products Retrieved Successfully", $products];
	}

	public function store($request)
	{
		$product = new Product;
		$product->code = $this->generateUniqueCode(Product::class);
		$product->name = $request->name;
		$product->price = $request->price;
		$product->created_by = $this->id;
		$product->save();

		return [true, "Product Created Successfully", $product];
	}

	public function show($product)
	{
		return [true, "Product Retrieved Successfully", $product];
	}

	public function update($request, $id)
	{
		$product = Product::findOrFail($id);
		$product->name = $request->input("name", $product->name);
		$product->price = $request->input("price", $product->price);
		$product->save();

		return [true, "Product Updated Successfully", $product];
	}

	public function destroy($id)
	{
		$product = Product::findOrFail($id);
		$deleted = $product->delete();

		return [$deleted, "Product Deleted Successfully", $product];
	}

	public function search($query, $request)
	{
		if ($request->filled("code")) {
			$query->where("code", "LIKE", "%" . $request->code . "%");
		}

		if ($request->filled("name")) {
			$query->where("name", "LIKE", "%" . $request->name . "%");
		}

		return $query;
	}
}
