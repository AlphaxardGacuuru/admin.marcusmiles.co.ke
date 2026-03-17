<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\SupplierGoodPriceResource;

class SupplierGoodResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $currentPrice = $this->supplierGoodPrices()
            ->orderBy("id", "desc")
            ->first()
            ->price;

        $markup = ($this->good->markup / 100) + 1;

        return [
            "id" => $this->id,
            "goodId" => $this->good->id,
            "goodCode" => $this->good->code,
            "goodName" => $this->good->name,
            "goodMarkup" => $this->good->markup,
            "supplierId" => $this->supplier->id,
            "supplierName" => $this->supplier->name,
            "createdByName" => $this->createdBy->name,
            "currentPrice" => number_format($currentPrice),
            "sellingPrice" => number_format($currentPrice * $markup),
            "prices" => SupplierGoodPriceResource::collection($this->supplierGoodPrices),
        ];
    }
}
