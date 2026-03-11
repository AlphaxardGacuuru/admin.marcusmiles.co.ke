<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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

        // Split the string by spaces into an array of words and get initials
        $clientInitials = collect(explode(' ', $this->client?->name))
            ->map(fn($word) => substr($word, 0, 1));

        return [
            "id" => $this->id,
            "code" => $this->code,
            "name" => $this->name,
            "type" => $this->type,
            "description" => $this->description,
            "location" => $this->location,
            "createdBy" => $this->createdBy->name,
            "clientInitials" => $clientInitials,
            "clientName" => $this->client?->name,
            "workPlanCount" => $this->workPlans->count(),
            "inventoryCount" => $this->inventories->count(),
            "position" => $this->position,
            "new" => $this->new,
            "currentStageId" => $this->currentStage()?->stage_id,
            "currentStageName" => $this->currentStage()?->stage->name,
            "updatedAt" => $this->updated_at,
            "createdAt" => $this->created_at,
        ];
    }
}
