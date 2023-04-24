<?php

namespace App\Http\Controllers;

use App\Models\categorie;
use App\Models\product;
use Illuminate\Http\Request;

class publiccontroller extends Controller
{
    function getcategory()
    {
        $category = categorie::where('status', 0)->get();
        if ($category) {
            return response()->json([
                'status' => 200,
                'çatgeory' => $category
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'msg' => 'no category found'
            ]);
        }

    }
    function viewproductbycatslug($slug)
    {
        $category = categorie::where('slug', $slug)->where('status',0)->first();

        if ($category) {
            $product = product::where('category_id', $category->id)->where('status',1)->where('quantity','>',0)->get();
            if ($product) {
                return response()->json([
                    'status' => 200,
                    'product' => $product,
                    'category' => $category
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'msg' => 'no product found'
                ]);
            }

        } else {
            return response()->json([
                'status' => 400,
                'msg' => 'no category found'
            ]);
        }

    }

    function viewproductdetailbycatslug($category, $product)
    {
        $category = categorie::where('slug', $category)->where('status',0)->first();

        if ($category) {
            $product = product::where('category_id', $category->id)->where('status', 1)->where('slug', $product)->first();
            if ($product) {
                return response()->json([
                    'status' => 200,
                    'product' => $product,
                    'category' => $category
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'msg' => 'no product found'
                ]);
            }

        } else {
            return response()->json([
                'status' => 400,
                'msg' => 'no category found'
            ]);
        }

    }
}