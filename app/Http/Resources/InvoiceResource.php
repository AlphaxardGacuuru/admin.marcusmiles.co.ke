<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
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
			"projectId" => $this->project->id,
			"projectName" => $this->project->name,
			"type" => $this->type,
			"total" => number_format($this->total),
			"paid" => number_format($this->paid),
			"balance" => number_format($this->balance),
			"status" => $this->status,
			"createdByName" => $this->createdBy->name,
			"issueDate" => $this->issue_date,
			"dueDate" => $this->due_date,
			"notes" => $this->notes,
			"items" => $this->invoiceItems,
			"updatedAt" => $this->updated_at,
			"createdAt" => $this->created_at,
		];
    }
}
