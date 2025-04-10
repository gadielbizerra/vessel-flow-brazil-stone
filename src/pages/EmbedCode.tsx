
import React from 'react';
import Layout from '@/components/Layout';
import EmbedCode from '@/components/EmbedCode';

const EmbedCodePage: React.FC = () => {
  return (
    <Layout>
      <div className="container max-w-4xl">
        <EmbedCode />
      </div>
    </Layout>
  );
};

export default EmbedCodePage;
