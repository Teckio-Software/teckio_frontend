import React from "react";
import { ColumnProps } from "../../../types/public-types";

export const DescripcionColumn: React.FC<ColumnProps> = ({
    data: { task }
}) => {
    const{
        descripcion	
    } = task
	return (
        <>
            {
                descripcion
            }
        </>
    )
};