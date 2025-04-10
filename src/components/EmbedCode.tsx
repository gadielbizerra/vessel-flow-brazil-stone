
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EmbedCode: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  // Get the current domain
  const domain = window.location.origin;
  const embedCode = `<iframe src="${domain}/embed" width="100%" height="600" frameborder="0" style="border-radius: 8px;"></iframe>`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Copy className="h-6 w-6" />
          <span>Código para Incorporar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-4">
            Cole este código no seu site (WordPress, Wix, etc.) para exibir os movimentos atualizados.
          </p>
          
          <div className="relative">
            <Input
              readOnly
              value={embedCode}
              className="pr-20 font-mono text-sm h-auto py-4"
            />
            <Button
              className="absolute right-1 top-1"
              size="sm"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Pré-visualização</h3>
          <div className="bg-gray-100 rounded-md p-4 aspect-video flex items-center justify-center border border-dashed">
            <p className="text-muted-foreground text-sm">
              A visualização está disponível no endereço:
              <br />
              <a 
                href="/embed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary font-medium underline underline-offset-4 hover:text-primary/80"
              >
                {domain}/embed
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmbedCode;
