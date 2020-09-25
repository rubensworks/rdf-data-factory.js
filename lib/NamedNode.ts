import type * as RDF from 'rdf-js';

/**
 * A term that contains an IRI.
 */
export class NamedNode<Iri extends string = string> implements RDF.NamedNode<Iri> {
  public readonly termType = 'NamedNode';
  public readonly value: Iri;

  public constructor(value: Iri) {
    this.value = value;
  }

  public equals(other?: RDF.Term | null): boolean {
    return !!other && other.termType === 'NamedNode' && other.value === this.value;
  }
}
