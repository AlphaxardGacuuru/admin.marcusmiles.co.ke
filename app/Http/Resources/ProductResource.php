<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        if ($request->filled("idAndName")) {
            return [
                "id" => $this->id,
                "name" => $this->name,
                "price" => $this->price,
            ];
        }

        return [
            "id" => $this->id,
            "code" => $this->code,
            "name" => $this->name,
            "price" => number_format($this->price),
            "createdByName" => $this->createdBy->name,
            "createdAt" => $this->created_at,
        ];
    }
}
