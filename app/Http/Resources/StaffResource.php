<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StaffResource extends JsonResource
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
            "name" => $this->name,
            "avatar" => $this->avatar,
            "email" => $this->email,
            "phone" => $this->phone,
            "gender" => $this->gender,
            "roleNames" => $this->roles
                ->map(fn($role) => $role->name),
            "permissions" => $this->roles
                ->map(fn($role) => $role->permissions)
                ->flatten(),
            "createdAt" => $this->created_at,
        ];
    }
}
