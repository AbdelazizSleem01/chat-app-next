import { error } from "console";
import { useMutation } from "convex/react";
import { useState } from "react"

export const useMutationState = (mutationToRun: any) => {
    const [pending, setPending] = useState(false);
    const mutationFu = useMutation(mutationToRun)

    const mutate = (payload: any) => {
        setPending(true)

        return mutationFu(payload)
            .then((res) => { return res })
            .catch((error) => { throw error })
            .finally(() => { setPending(false) });
    }

    return {
        mutate,
        pending
    }
}