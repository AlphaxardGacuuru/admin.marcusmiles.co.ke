<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectServiceProviderResource extends JsonResource
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
			"serviceProviderId" => $this->service_provider_id,
			"serviceProviderAvatar" => $this->serviceProvider->avatar,
			"serviceProviderName" => $this->serviceProvider->name,
			"serviceProviderPhone" => $this->serviceProvider->phone,
			"serviceProviderIdNumber" => $this->serviceProvider->id_number,
			"projectId" => $this->project_id,
			"projectCode" => $this->project->code,
			"projectName" => $this->project->name,
			"projectType" => $this->project->type,
			"projectLocation" => $this->project->location,
			"projectCreatedBy" => $this->createdBy->name,
			"projectCreatedAt" => $this->project->createdAt,
			"labourRate" => $this->labour_rate,
			"quantityOfWork" => $this->quantity_of_work,
			"totalAmount" => number_format($this->total_amount),
			"service" => $this->service,
			"status" => $this->status,
			"startDate" => $this->start_date,
			"endDate" => $this->end_date,
            "startDateRaw" => Carbon::parse($this->start_date)->format("Y-m-d"),
            "endDateRaw" => Carbon::parse($this->end_date)->format("Y-m-d"),
			"updatedAt" => $this->updated_at,
			"createdAt" => $this->created_at,
		];
    }
}
