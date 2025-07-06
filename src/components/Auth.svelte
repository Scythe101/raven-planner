<script>
    let register = false;
    let email = '';
    let password = '';
    let confirmPassword = '';
</script>
<div>
    <h1>Sign Up</h1>
    <form>
        <label>
            <input type="text" placeholder="Email"/>
        </label>
        <label>
            <input type="password" placeholder="Password"/>
        </label>
        {#if register}
            <label>
                <input type="password" placeholder="Confirm Password"/>
            </label>
        {/if}
        <button type="submit">Sign Up</button>
    </form>
</div>