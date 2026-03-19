<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GoodResource extends JsonResource
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
            ];
        }
        
        return [
			"id" => $this->id,
			"code" => $this->code,
			"name" => $this->name,
			"markup" => $this->markup,
			"notificationQuantity" => $this->notification_quantity,
			"createdBy" => $this->createdBy->name,
			"updatedAt" => $this->updated_at,
			"createdAt" => $this->created_at,
		];
    }
}
