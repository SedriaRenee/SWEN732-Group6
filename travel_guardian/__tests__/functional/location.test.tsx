import {test, expect} from 'vitest';
import { render, screen,waitFor } from '@testing-library/react'
import Navbar from '@/components/Navbar';
import { describe } from 'node:test';
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

describe("Location Functional Tests", () => {

    // Test view component for location searching
    test('Navbar location search', async () => {
        render(<Navbar />);
        const search = screen.getByTestId('search');
        const user = userEvent.setup();
    
        await user.type(search, "New York");
        
        const form = search.parentElement as HTMLFormElement;
        const button = search.nextSibling as HTMLButtonElement;
    
        const submitSpy = vi.fn();
        form.addEventListener("submit", submitSpy);
        
        await user.click(button);
    
        expect(submitSpy).toHaveBeenCalled();
    
        const results = await waitFor(() => screen.getAllByTestId('location'));
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(1); // 2
    
    });
    
});
