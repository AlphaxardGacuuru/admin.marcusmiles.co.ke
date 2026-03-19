<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'updated_at' => 'datetime:d M Y',
        'created_at' => 'datetime:d M Y',
    ];

    /**
     * Accesors.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     */
    protected function updatedAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->format('d M Y'),
        );
    }

    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->format('d M Y'),
        );
    }

    /*
     * Relationships
     */

    public function createdBy()
    {
        return $this->belongsTo(User::class, "created_by");
    }

    public function client()
    {
        return $this->belongsTo(User::class, "client_id");
    }

	public function workPlans()
	{
		return $this->hasMany(WorkPlan::class);
	}

	public function inventories()
	{
		return $this->hasMany(Inventory::class);
	}

	public function serviceProviders()
	{
		return $this->hasMany(ProjectServiceProvider::class);
	}

	public function stages()
    {
        return $this->belongsToMany(Stage::class, 'project_stages', 'project_id', 'stage_id');
    }

    public function projectStages()
    {
        return $this->hasMany(ProjectStage::class);
    }

    public function latestProjectStage()
    {
        return $this->hasOne(ProjectStage::class)->latestOfMany();
    }

    /*
     * Custom Functions
     */

    public function currentStage()
    {
        return $this->projectStages()
            ->orderBy("id", "desc")
            ->first();
    }
}
