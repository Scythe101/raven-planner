<script>
    let { name, difficulty, type, homework, url } = $props();
    const capitalize = str => {
        if (typeof str === 'string') {
            return str.replace(/^\w/, c => c.toUpperCase())
        } else {
            return ''
        }
    }
</script>

<a class="bg-blue-100 p-4 rounded-lg h-32" href={url}>
    <h3 class="font-bold text-lg">{name}</h3>
    <p>{capitalize(difficulty)}</p>
    <p>{capitalize(type)}</p>
    <p>{homework} Minutes</p>
</a>