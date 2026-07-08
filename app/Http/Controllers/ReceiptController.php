<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReceiptController extends Controller
{
    public function store(Request $request, int $paymentId)
    {
        $payment = Payment::findOrFail($paymentId);

        $request->validate([
            'receipt_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'action' => 'required|in:upload,generate'
        ]);

        if ($request->action === 'upload' && $request->hasFile('receipt_file')) {
            $path = $request->file('receipt_file')->store('receipts', 'public');
            
            $payment->update([
                'receipt_type' => 'uploaded_file',
                'receipt_url' => Storage::url($path)
            ]);

            return back()->with('success', 'Receipt uploaded successfully.');
        } elseif ($request->action === 'generate') {
            // Placeholder for PDF generation
            $payment->update([
                'receipt_type' => 'auto_generated',
                'receipt_url' => '#' // would be route to generate/view pdf
            ]);

            return back()->with('success', 'Receipt generated successfully.');
        }

        return back()->with('error', 'Invalid action or missing file.');
    }
}
