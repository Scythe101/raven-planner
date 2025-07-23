<script>
    let {} = $props();
</script>

<div class="w-full max-w-sm rounded-md bg-blue-100 h-32 cursor-progress">
    <div class="flex animate-pulse space-x-4 ml-4 mt-4">
        <div class="flex-1 space-y-3 py-1">      
            <div class="h-3 rounded bg-blue-200"></div>
            <div class="space-y-4">
                <div class="h-2 rounded bg-blue-200 w-1/3"></div>
                <div class="h-2 rounded bg-blue-200 w-1/3"></div>

                <div class="grid grid-cols-5 gap-2">
                    <div class="col-span-1 h-2 rounded bg-blue-200"></div>
                    <div class="col-span-2 h-2 rounded bg-blue-200"></div>
                </div>
            </div>    
        </div>
        <div class="h-2 bg-gray-200"></div>
    </div>
</div>