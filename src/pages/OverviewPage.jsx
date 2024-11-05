import React, { useState, useEffect } from "react";
import axios from "axios";

function OverviewPage() {
    return (
        <div>
            <h1>Overview Page</h1>
            <p>TODO</p>
            <li>
                <a>graphs</a>
                <a>budget: spend x out of y</a>
                <a>category budgets: spent x out of y in z category</a>
            </li>
        </div>
    );
}
export default OverviewPage;