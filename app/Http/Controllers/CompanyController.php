<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::query();

        // Apply filters
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        $companies = $query->paginate(10)->withQueryString();

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'certification_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'link' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $company = new Company();
            $data = $request->except(['certification_images', 'logo']);

            // Handle logo
            if ($request->hasFile('logo')) {
                $logo = $request->file('logo');
                $path = $logo->store('companies/logos', 'public');
                $data['logo'] = $path;
            }

            // Handle certification images
            if ($request->hasFile('certification_images')) {
                $files = $request->file('certification_images');
                if (count($files) > 5) {
                    return back()->with('error', 'Maximum 5 certification images allowed.')->withInput();
                }

                $certificationImages = [];
                foreach ($files as $image) {
                    $path = $image->store('companies/certifications', 'public');
                    $certificationImages[] = $path;
                }
                $data['certification_images'] = $certificationImages;
            }

            $company->fill($data);
            $company->save();

            return redirect()->route('companies.index')->with('success', 'Company created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create company: ' . $e->getMessage())->withInput();
        }
    }

    public function update(Request $request, Company $company)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'certification_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'link' => 'nullable|url',
            'remove_certification_images' => 'array',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $data = $request->except(['certification_images', 'logo', 'remove_certification_images']);

            // Handle logo
            if ($request->hasFile('logo')) {
                // Delete old logo
                if ($company->logo && Storage::disk('public')->exists($company->logo)) {
                    Storage::disk('public')->delete($company->logo);
                }

                $logo = $request->file('logo');
                $path = $logo->store('companies/logos', 'public');
                $data['logo'] = $path;
            }

            // Handle certification images
            if ($request->hasFile('certification_images')) {
                $currentImages = $company->certification_images ?? [];
                $newFiles = $request->file('certification_images');

                if (count($currentImages) + count($newFiles) > 5) {
                    return back()->with('error', 'Maximum 5 certification images allowed.')->withInput();
                }

                foreach ($newFiles as $image) {
                    $path = $image->store('companies/certifications', 'public');
                    $currentImages[] = $path;
                }
                $data['certification_images'] = $currentImages;
            }

            // Remove certification images
            if ($request->has('remove_certification_images')) {
                $currentImages = $company->certification_images ?? [];
                $imagesToRemove = $request->remove_certification_images;
                $remainingImages = array_diff($currentImages, $imagesToRemove);

                // Delete files from storage
                foreach ($imagesToRemove as $image) {
                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }

                $data['certification_images'] = array_values($remainingImages);
            }

            $company->fill($data);
            $company->save();

            return redirect()->route('companies.index')->with('success', 'Company updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update company: ' . $e->getMessage())->withInput();
        }
    }

    public function destroy(Company $company)
    {
        try {
            // Delete logo
            if ($company->logo && Storage::disk('public')->exists($company->logo)) {
                Storage::disk('public')->delete($company->logo);
            }

            // Delete certification images
            if ($company->certification_images) {
                foreach ($company->certification_images as $image) {
                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }
            }

            $company->delete();

            return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete company: ' . $e->getMessage());
        }
    }
}
