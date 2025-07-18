import React, { useEffect, useState } from "react";
import { ColumnProps } from "../../../types/public-types";

export const ImporteColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
    const {
        importe
    } = task;
    
    
    
    return (
        <div>
            {Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',minimumFractionDigits:0,maximumFractionDigits:0}).format(importe ?? 0)} 
        </div>
    );
};
