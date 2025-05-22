"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AddBlindBoxPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Add Blind Box</h1>
      <Card>
        <CardContent className="p-4 space-y-4">
          <Input name="name" placeholder="Name" />
          <Textarea name="description" placeholder="Description" />
          <Input name="price" placeholder="Price" type="number" />
          <Input name="totalQuantity" placeholder="Total Quantity" type="number" />
          <Input name="probabilityConfig" placeholder="Probability Config" />
          <div className="flex items-center space-x-2">
            <Label htmlFor="hasSecretItem">Has Secret Item?</Label>
            <Switch id="hasSecretItem" />
          </div>
          <Input
            name="secretProbability"
            placeholder="Secret Probability"
            type="number"
            step="0.01"
          />
          <Input name="imageUrl" placeholder="Image URL" />
          <Input name="releaseDate" placeholder="Release Date" type="date" />
          <Button>Add Blind Box</Button>
        </CardContent>
      </Card>
    </div>
  );
}
