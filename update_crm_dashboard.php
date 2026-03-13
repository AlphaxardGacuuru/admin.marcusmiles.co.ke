<?php
$file = 'app/Http/Services/CRMDashboardService.php';
$content = file_get_contents($file);

$imports = "use App\Models\Payment;\nuse App\Models\CreditNote;\n";
$content = str_replace('use Carbon\Carbon;', "use Carbon\Carbon;\n" . $imports, $content);

$index_old = 'return [
                        "clients" => $this->clients(),
                        "quotations" => $this->quotations(),
                        "invoices" => $this->invoices(),
                ];';
$index_new = 'return [
                        "clients" => $this->clients(),
                        "quotations" => $this->quotations(),
                        "invoices" => $this->invoices(),
                        "payments" => $this->payments(),
                        "creditNotes" => $this->creditNotes(),
                ];';
$content = str_replace($index_old, $index_new, $content);

$methods = '
        /*
     * Payments
     */
        public function payments()
        {
                $chartBox = $this->getChartBoxData(Payment::class);

                return [
                        "chartBox" => $chartBox,
                ];
        }

        /*
     * Credit Notes
     */
        public function creditNotes()
        {
                $chartBox = $this->getChartBoxData(CreditNote::class);

                return [
                        "chartBox" => $chartBox,
                ];
        }

        public function getChartBoxData';

$content = str_replace('public function getChartBoxData', ltrim($methods), $content);

file_put_contents($file, $content);
