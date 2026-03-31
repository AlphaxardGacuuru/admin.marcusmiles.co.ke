<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "code" => $this->code,
            "clientId" => $this->client->id,
            "clientName" => $this->client->name,
            "tax" => $this->tax,
            "total" => number_format($this->total),
            "status" => $this->status,
            "createdByName" => $this->createdBy->name,
            "notes" => $this->notes,
            "items" => $this->orderItems->map(
                fn($item) => [
                    "id" => $item->id,
                    "productId" => $item->product_id,
                    "productName" => $item->product->name,
                    "quantity" => $item->quantity,
                    "rate" => $item->rate,
                    "total" => $item->total,
                ]
            ),
            "updatedAt" => $this->updated_at,
            "createdAt" => $this->created_at,
        ];
    }
}
