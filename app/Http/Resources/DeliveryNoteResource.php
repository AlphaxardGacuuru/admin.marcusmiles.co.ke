<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryNoteResource extends JsonResource
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
			"clientId" => $this->project->client_id,
			"clientName" => $this->project->client->name,
			"projectId" => $this->project->id,
			"projectCode" => $this->project->code,
			"projectName" => $this->project->name,
			"inventories" => InventoryResource::collection($this->inventories),
			"createdById" => $this->createdBy->id,
			"createdByName" => $this->createdBy->name,
			"receivedById" => $this->receivedBy?->id,
			"receivedByName" => $this->receivedBy?->name,
			"updatedAt" => $this->updatedAt,
			"createdAt" => $this->createdAt,
		];
    }
}
