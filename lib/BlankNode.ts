import * as RDF from 'rdf-js';

/**
 * Contains an RDF blank node.
 */
export class BlankNode implements RDF.BlankNode {
  public readonly termType = 'BlankNode';
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public equals(other: RDF.Term | null | undefined): boolean {
    return !!other && other.termType === 'BlankNode' && other.value === this.value;
  }
}
